import os
from datetime import datetime
from playwright.sync_api import sync_playwright, Playwright
from helpers.credentials import get_credentials
from configs.env import Env
from utils.months_dict import MONTHS
class PlaywrightController:
    def __init__(self, bill_date: datetime):
        self.playwright: Playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=Env.HEADLESS)
        self.context = self.browser.new_context()
        self.context.tracing.start(
            screenshots=True,
            snapshots=True,
            sources=True
        )
        self.page = self.context.new_page()
        self.credentials = get_credentials()
        self.bill_date = bill_date
        bp=1
    
    def _sleep(self, seconds: int):
        self.page.wait_for_timeout(seconds * 1000)

    def _get_semester(self):
        year = self.bill_date.strftime("%y")
        month = self.bill_date.month
        if month <= 6:
            semester = 1
        else:
            semester = 2
        return f"Período {year}.{semester}", f"{year}-{semester}"
    
    def _get_competencia(self):
        month = MONTHS[self.bill_date.month]
        year = self.bill_date.year
        return f"{month}/{year}"

    def _login_unifor(self):
        self.page.goto("https://uol.unifor.br/acesso/app/autenticacao/")
        self.page.locator('input[formcontrolname="username"]').fill(self.credentials["username"])
        self.page.locator('input[formcontrolname="password"]').fill(self.credentials["password"])
        self.page.get_by_role("button", name="Acessar").click()
        self._sleep(5)

    def _download_pdf(self, billing_page):
        document = None
        try:
            billing_page.locator('button:has(label:has-text("BOLETO BANCÁRIO"))').click()
            download_button = billing_page.locator('button[aria-label="Baixar Boleto"]')
            if Env.HEADLESS:
                with billing_page.expect_download() as download_info:
                    download_button.click()

                download = download_info.value
                download_path = download.path()  # caminho temporário no sistema de arquivos
                if download_path and os.path.exists(download_path):
                    with open(download_path, "rb") as f:
                        document = f.read()
                    print("Download realizado e lido com sucesso.")
                else:
                    print("Arquivo de download não encontrado.")
            else:
                with billing_page.expect_popup() as pdf_page:
                    download_button.click()
                    pdf_url = pdf_page.value.url
                    print(f"Boleto PDF URL: {pdf_url}")
                    pdf_bytes = pdf_page.value.evaluate("""
                        async () => {
                            const response = await fetch(window.location.href);
                            const blob = await response.blob();
                            const buffer = await blob.arrayBuffer();
                            return Array.from(new Uint8Array(buffer));
                        }
                        """)
                    document = bytes(pdf_bytes)
        except Exception as e:
            print(f"Erro ao baixar o boleto: {e}")
            self.context.tracing.stop(
                path=f"traces/trace-{self.bill_date.strftime('%Y-%m-%d')}.zip"
            )
        finally:
            return document

    def _acess_billing_page(self):
        billing_page = None
        document_name = ""
        try:
            self.page.goto("https://uol.unifor.br/financeiro/painel-financeiro/extrato")
            self.page.locator('span.p-tabview-title:has-text("Mensalidade")').click()
            semestre, semestre_for_name = self._get_semester()
            competencia = self._get_competencia()
            document_name = f"Mensalidade_{semestre_for_name}_{competencia}.pdf"
            self.page.get_by_role("button", name=f"{semestre}").click()
            go_to_billing_button = self.page.get_by_role("row").filter(has_text=competencia).locator(".pi-dollar")
            if go_to_billing_button:
                with self.page.expect_popup() as new_page:
                    go_to_billing_button.click()
                    billing_page = new_page.value

            else:
                print(f"Nenhum boleto encontrado para {semestre} - {competencia}")
                self.page.close()
                self.browser.close()
                self.playwright.stop()
        except Exception as e:
            print(f"Erro ao acessar a aba de mensalidade: {e}")
            self.context.tracing.stop(
                path=f"traces/trace-{self.bill_date.strftime('%Y-%m-%d')}.zip"
            )
        finally:
            return billing_page, document_name

    def get_monthly_bill(self):
        monthly_bill = {"name": "", "document": b""}
        try:
            self._login_unifor()
            billing_page, document_name = self._acess_billing_page()
            document = self._download_pdf(billing_page)
            monthly_bill['name'] = document_name
            monthly_bill['document'] = document
        except Exception as e:
            print(f"Erro ao obter o boleto: {e}")
            self.context.tracing.stop(
                path=f"traces/trace-{self.bill_date.strftime('%Y-%m-%d')}.zip"
            )
        finally:
            self.page.close()
            self.browser.close()
            self.playwright.stop()
            return monthly_bill
        