import {StaticImageData} from "next/image";

interface Champion {
  name: string;
  subname: string;
  chosung: string;
  image: string | StaticImageData;
}