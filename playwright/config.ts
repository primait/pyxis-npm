import { chromium, devices, firefox, webkit } from "playwright";

const deviceNames = [
  "iPhone 8",
  "iPhone X",
  "iPad (gen 7)",
  "iPad Pro 11",
  "Galaxy S5",
  "Pixel 2 XL",
  "Nexus 10",
];

export default {
  baseUrl: "http://0.0.0.0:8080/",
  browsers: [chromium, firefox, webkit],
  devices: deviceNames.map((deviceName) => ({
    name: deviceName,
    deviceDescriptor: devices[deviceName],
  })),
  screenshotsPath: "screenshots/",
  tolerance: 0.05,
};
