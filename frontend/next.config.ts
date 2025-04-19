import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn02.pinkoi.com",
      "down-th.img.susercontent.com",
      "image.makewebeasy.net",
      "img.advice.co.th",
      "static.siamtv.com",
      "media-cdn.bnn.in.th",
      "www.digital2home.com",
      "www.atprosound.com",
      "cdn-icons-png.flaticon.com", // <- just in case
    ],
  },
};

export default withFlowbiteReact(nextConfig);
