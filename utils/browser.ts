import puppeteer from "puppeteer";

export async function executeRegisterAutomation(
  url: string,
  registerInfo: Object,
) {
  console.log(url);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1080, height: 1024 },
  });
  const pages = await browser.pages();
  for (const p of pages) {
    await p.close();
  }

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  await page.goto(url);

  await page.waitForSelector(".stacked-actions a");

  const firstLink = await page.$(".stacked-actions a");
  if (firstLink) {
    await firstLink.click();
    console.log("已点击第一个按钮");
  } else {
    console.warn("未找到 stacked-actions 下的链接");
  }

  await page.waitForSelector("input#user_account_attributes_username");
  await page.waitForSelector("input#user_password");
  await page.waitForSelector("input#user_email");
  await page.waitForSelector("input#user_password_confirmation");
  await page.waitForSelector("input#user_agreement");
  await page.waitForSelector('button[type="submit"]');

  await fillAndSubmit(page, registerInfo);
  await page.close();
  await browser.close();
}

async function fillAndSubmit(page: any, registerInfo: Object) {
  await page.type("#user_account_attributes_username", registerInfo.username);
  await new Promise((r) => setTimeout(r, 1000));

  await page.type("#user_email", registerInfo.email);
  await new Promise((r) => setTimeout(r, 1000));

  await page.type("#user_password", registerInfo.password);
  await new Promise((r) => setTimeout(r, 1000));

  await page.type("#user_password_confirmation", registerInfo.password);
  await new Promise((r) => setTimeout(r, 1000));

  await page.click("input#user_agreement");

  await page.click('button[type="submit"]');
}
