import axios from 'axios';

export interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGECity {
  id: number;
  nome: string;
}

export const fetchStates = async (): Promise<IBGEUF[]> => {
  try {
    const response = await axios.get<IBGEUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    return [];
  }
};

export const fetchCitiesByState = async (uf: string): Promise<IBGECity[]> => {
  try {
    const response = await axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar cidades do estado ${uf}:`, error);
    return [];
  }
};

export const fetchCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,idd,flags');
    return response.data.map((country: any) => ({
      name: country.name.common,
      ddi: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
      flag: country.flags.svg
    })).sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Erro ao buscar países:', error);
    return [{ name: 'Brasil', ddi: '+55', flag: 'https://flagcdn.com/br.svg' }];
  }
};

export const BRAZIL_DDDS = [
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99'
];
