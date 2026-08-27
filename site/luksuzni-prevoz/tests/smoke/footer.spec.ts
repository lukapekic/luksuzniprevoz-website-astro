import { test, expect, type Locator } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  defaultLocale,
  locales,
  reviewViewports,
  routePath,
} from "../support/contracts";

const footerSelector = ".site-footer";
const contactChannelSelector = ".site-footer__link--channel";
const contactFactSelector = ".site-footer__fact";
const contactAddressSelector = ".site-footer__address";

type ContactTextStyle = {
  color: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
};

const contactTextStyle = (locator: Locator): Promise<ContactTextStyle> =>
  locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.color,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
    };
  });

test.describe("SiteFooter visual contract", () => {
  for (const viewport of reviewViewports) {
    test(`${viewport.name}: GS-only brand and coherent contact text`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath("home", defaultLocale));

      const footer = page.locator(footerSelector);
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();

      const brandLink = footer.getByRole("link", { name: "Luxury Transportation" });
      await expect(brandLink.locator("svg")).toBeVisible();
      const wordmarkBox = await brandLink.locator("[data-brand-wordmark]").boundingBox();
      expect(wordmarkBox).toBeTruthy();
      expect(wordmarkBox!.width).toBeLessThanOrEqual(1);

      const channel = footer.locator(contactChannelSelector).first();
      const channelStyle = await contactTextStyle(channel);
      expect(await contactTextStyle(footer.locator(contactFactSelector))).toEqual(channelStyle);
      expect(await contactTextStyle(footer.locator(contactAddressSelector))).toEqual(channelStyle);

      const channelBox = await channel.boundingBox();
      expect(channelBox).toBeTruthy();
      expect(channelBox!.width).toBeGreaterThanOrEqual(44);
      expect(channelBox!.height).toBeGreaterThanOrEqual(44);
      await assertNoHorizontalOverflow(page);
    });
  }

  for (const locale of locales) {
    test(`${locale}: localized footer preserves the contact text system`, async ({ page }) => {
      await page.goto(routePath("home", locale));
      const footer = page.locator(footerSelector);
      const channelStyle = await contactTextStyle(footer.locator(contactChannelSelector).first());
      expect(await contactTextStyle(footer.locator(contactFactSelector))).toEqual(channelStyle);
      expect(await contactTextStyle(footer.locator(contactAddressSelector))).toEqual(channelStyle);
    });
  }
});
