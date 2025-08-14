import SoftwareDevelopment from "@/components/service/software-development-new";
import GsapSlider from "@/components/gsap/GsapSlider";

const webDevelopmentExamples = [
  {
    title: "E-commerce",
    bgColor: "#1E1E1E",
    url: "/portfolio/ecommerce",
    img: "/service/ecommerce.png"
  },
  {
    title: "Landing Page",
    bgColor: "#06414D",
    url: "/portfolio/landing-page",
    img: "/service/landing-page.png"
  },
  {
    title: "Academia Web",
    bgColor: "#025159",
    url: "/portfolio/academia-web",
    img: "/service/academia-web.png"
  },
  {
    title: "Portafolio Web",
    bgColor: "#D9D9D9",
    url: "/portfolio/portafolio-web",
    img: "/service/portafolio-web.png"
  },
  {
    title: "Web Empresarial",
    bgColor: "#2D3748",
    url: "/portfolio/web-empresarial",
    img: "/service/web-empresarial.png"
  }
];

export default function SoftwareDevelopmentPage() {
  return (
    <>
      <SoftwareDevelopment />
      <GsapSlider title="Desarrollo de Software" examples={webDevelopmentExamples} />
    </>
  );
}
