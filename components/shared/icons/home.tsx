import Image from "next/image";
import home from "public/home.png";

export const HomeIcon = (
  <Image
    alt=""
    priority
    placeholder="blur"
    src={home}
    quality={100}
    className="h-screen w-screen opacity-0 transition-opacity duration-[0.3s]"
    onLoadingComplete={(image) => {
      document.getElementById("mainPage")?.classList.remove("opacity-0");
      image.classList.remove("opacity-0");
    }}
    style={{ objectFit: "cover", objectPosition: "right" }}
  />
);
