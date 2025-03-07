import {StaticImageData} from "next/image";

export interface Champion {
  name: string;
  subname: string;
  chosung: string;
  image: string | StaticImageData;
}