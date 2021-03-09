import { Page } from "playwright";

/**
 * Before we can evaluate visual regressions,
 * pages need to be stabilized to a fixed reference point.
 *
 * For instance:
 * - animations need to be frozen on their first frame
 * - some dynamic assets need to be hidden
 */
export const stabilizePage = async (page: Page) => {
  await page.addStyleTag({
    content: `
*,
*::before,
*::after {
-moz-transition: none !important;
transition: none !important;
-moz-animation: none !important;
animation: none !important;
}

#jsCookies {
display: none!important;
}

svg,
img,
#waves,
#jsTrustpilotRoot,
#jsSocietyTypewriterCaret,
.clock-header__clock,
.a-trustpilotWidget,
.plate-number__wrapper.is-fixed {
    visibility: hidden!important;
}

.o-jumbotron--animatedBg {
    background-image: none!important;
}

.footer {
    position: relative!important;
}
`,
  });
};
