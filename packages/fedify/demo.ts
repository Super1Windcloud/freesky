import puppeteer from "puppeteer";

async function executeRegisterAutomation(url: string , registerInfo  :Object  ) {
  const browser = await puppeteer.launch({
    headless: false, // 可视化调试
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

  await page.waitForSelector('input#user_account_attributes_username');
  await page.waitForSelector('input#user_password');
  await page.waitForSelector('input#user_email');
  await page.waitForSelector('input#user_password_confirmation');


  await page.type('#user_account_attributes_username', registerInfo.username);
  await page.type('#user_password', registerInfo.password);
  await page.type('#user_email',  registerInfo.email);
  await page.type('#user_password_confirmation', registerInfo.password);

  await page.waitForSelector('input#user_agreement');
  await page.click('input#user_agreement');

  await page.waitForSelector('button[type="submit"]');
  await page.click('button[type="submit"]');


  // await page.close();
}
// input  id =user_name   , id=user_password   , id= user_email,  user_password_confirmation
const obj = {
  username : "super",
  password : "superwindcloud",
  email : "1178933440@qq.com",

}
await executeRegisterAutomation("https://techhub.social/auth/sign_up", obj);
