import SoftwareDevelopment from "@/components/service/software-development-new";
import GsapSlider from "@/components/gsap/GsapSlider";

const webDevelopmentExamples = [
  {
    title: "E-commerce",
    bgColor: "#1E1E1E",
    url: "https://petgourmet.mx/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/pet-gourmet.mp4"
  },
  {
    title: "Landing Page",
    bgColor: "#1E1E1E",
    url: "https://www.sulkarsas.com/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/sulkar.mp4"
  },
  {
    title: "Academia Web",
    bgColor: "#1E1E1E",
    url: "https://edux.com.co/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/edux.mp4"
  },
  {
    title: "Portafolio Web",
    bgColor: "#1E1E1E",
    url: "https://tecnocrypter.com/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/tecnocrypter.mp4"
  },
  {
    title: "Demo",
    bgColor: "#1E1E1E",
    url: "https://beaconhelp.netlify.app/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/beaconhelp.mp4"
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
