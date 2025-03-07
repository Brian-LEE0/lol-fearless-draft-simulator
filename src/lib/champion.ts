import {Champion} from '@/types/champion';
import * as hangul from 'hangul-js';
// import {GetServerSideProps} from 'next';

const LOL_CDN_URL = 'https://ddragon.leagueoflegends.com/cdn/15.4.1';

export async function fetchChampions(): Promise<Champion[]> {
  const response = await fetch(`${LOL_CDN_URL}/data/ko_KR/champion.json`);
  console.log(response);
  const data = await response.json();

  return Object.values(data.data).map((champion: any) => ({
    name: champion.name,
    subname: champion.id,
    chosung: getChosung(champion.name),
    image: `${LOL_CDN_URL}/img/champion/${champion.image.full}`,
  }));
}

function getChosung(text: string): string {
    const disassembled = hangul.disassemble(text, true);
    const chosung = disassembled.map(char => char[0]).join('');
    return chosung;
  }
  