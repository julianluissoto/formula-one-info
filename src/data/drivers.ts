import careers from "./careers.json";
import type { CareerEntry, Driver, DriverRole } from "./types";

const careerData = careers as Record<string, CareerEntry[]>;

// careerKey coincide con jolpicaId, salvo en los pilotos que la API no tiene (jolpicaId: null).
const d = (
  slug: string, careerKey: string, name: string, number: number | null, role: DriverRole, teams: string[],
  nationality: string, birthDate: string, birthPlace: string, karting: string, extra: Partial<Driver> = {},
): Driver => ({
  slug, jolpicaId: careerKey, name, number, role, teams, nationality, birthDate, birthPlace, karting,
  career: careerData[careerKey] ?? [], ...extra,
});

// Biografías y karting: artículos de Wikipedia de cada piloto (25/11/2026).
export const drivers: Driver[] = [
  d("kimi-antonelli", "antonelli", "Kimi Antonelli", 12, "titular", ["mercedes"], "Italia", "2006-08-25", "Bolonia, Italia", "Campeón europeo sénior en 2020 y 2021."),
  d("george-russell", "russell", "George Russell", 63, "titular", ["mercedes"], "Reino Unido", "1998-02-15", "King's Lynn, Inglaterra", "Empezó a los siete años. Campeón europeo júnior en 2011 y 2012."),
  d("charles-leclerc", "leclerc", "Charles Leclerc", 16, "titular", ["ferrari"], "Mónaco", "1997-10-16", "Montecarlo, Mónaco", "Compitió desde los siete años. Ganó la Copa del Mundo júnior en 2011."),
  d("lewis-hamilton", "hamilton", "Lewis Hamilton", 44, "titular", ["ferrari"], "Reino Unido", "1985-01-07", "Stevenage, Inglaterra", "Empezó a los seis años. Ganó la Copa del Mundo y el Campeonato Europeo en 2000."),
  d("max-verstappen", "max_verstappen", "Max Verstappen", 3, "titular", ["red-bull"], "Países Bajos", "1997-09-30", "Hasselt, Bélgica", "Empezó a los cuatro años y cerró su etapa con una temporada récord en 2013."),
  d("isack-hadjar", "hadjar", "Isack Hadjar", 6, "titular", ["red-bull"], "Francia", "2004-09-28", "París, Francia", "Compitió desde 2012. Fue 22º en el Mundial de 2018.", { note: "Se perdió las rondas 12 a 14 de 2026 por lesión; lo reemplazó Liam Lawson." }),
  d("lando-norris", "norris", "Lando Norris", 1, "titular", ["mclaren"], "Reino Unido", "1999-11-13", "Bristol, Inglaterra", "Empezó a los ocho años. Campeón mundial sénior en 2014.", { note: "Usa el 1 como campeón de 2025." }),
  d("oscar-piastri", "piastri", "Oscar Piastri", 81, "titular", ["mclaren"], "Australia", "2001-04-06", "Melbourne, Australia", "Pasó de los autos a radiocontrol al karting; ganó títulos regionales en Australia."),
  d("liam-lawson", "lawson", "Liam Lawson", 30, "titular", ["racing-bulls"], "Nueva Zelanda", "2002-02-11", "Hastings, Nueva Zelanda", "Empezó en 2008. Ganó dos títulos en 2014.", { note: "Corrió para Red Bull en las rondas 12 a 14 de 2026, en lugar de Isack Hadjar." }),
  d("arvid-lindblad", "arvid_lindblad", "Arvid Lindblad", 41, "titular", ["racing-bulls"], "Reino Unido", "2007-08-08", "Virginia Water, Inglaterra", "Compitió desde 2015. Ganó la WSK Euro Series y la WSK Final Cup en OK."),
  d("pierre-gasly", "gasly", "Pierre Gasly", 10, "titular", ["alpine"], "Francia", "1996-02-07", "Ruan, Francia", "Compitió desde 2006, a los diez años; debutó con un 15º puesto en la categoría Minime francesa."),
  d("franco-colapinto", "colapinto", "Franco Colapinto", 43, "titular", ["alpine"], "Argentina", "2003-05-27", "Pilar, Buenos Aires", "Empezó a los nueve años. Ganó la exhibición de karting de los Juegos Olímpicos de la Juventud 2018 junto a María García Puig."),
  d("oliver-bearman", "bearman", "Oliver Bearman", 87, "titular", ["haas"], "Reino Unido", "2005-05-08", "Chelmsford, Inglaterra", "Compitió desde 2013. En 2019 ganó la final internacional IAME, la IAME Euro Series y la IAME Winter Cup."),
  d("esteban-ocon", "ocon", "Esteban Ocon", 31, "titular", ["haas"], "Francia", "1996-09-17", "Évreux, Francia", "Empezó en 2006, con un 8º puesto en la categoría Minime francesa.", { note: "Fue retirado del GP de México 2026 (ronda 19) tras un desacuerdo con el equipo. Lo reemplazaron Ryo Hirakawa (19) y Rafael Câmara (20 y 21)." }),
  d("nico-hulkenberg", "hulkenberg", "Nico Hülkenberg", 27, "titular", ["audi"], "Alemania", "1987-08-19", "Emmerich am Rhein, Alemania", "Empezó a los diez años. Campeón alemán júnior en 2002 y campeón alemán en 2003."),
  d("gabriel-bortoleto", "bortoleto", "Gabriel Bortoleto", 5, "titular", ["audi"], "Brasil", "2004-10-14", "Osasco, Brasil", "Compitió entre 2011 y 2019. En 2018 fue tercero en el Europeo y en el Mundial OK-Junior."),
  d("alexander-albon", "albon", "Alexander Albon", 23, "titular", ["williams"], "Tailandia", "1996-03-23", "Londres, Inglaterra", "Compitió desde 2005. En 2010 ganó la Copa del Mundo y el Europeo júnior."),
  d("carlos-sainz", "sainz", "Carlos Sainz", 55, "titular", ["williams"], "España", "1994-09-01", "Madrid, España", "Empezó en 2006. Campeón de Asia-Pacífico KF3 en 2008 y ganador de la Monaco Kart Cup júnior en 2009."),
  d("fernando-alonso", "alonso", "Fernando Alonso", 14, "titular", ["aston-martin"], "España", "1981-07-29", "Oviedo, España", "Tuvo su primer karting a los tres años. Ganó la Copa Cinco Continentes CIK-FIA en 1996."),
  d("lance-stroll", "stroll", "Lance Stroll", 18, "titular", ["aston-martin"], "Canadá", "1998-10-29", "Montreal, Canadá", "Empezó a los diez años. Novato del año de la federación de Quebec en 2008 y piloto del año en 2009."),
  d("sergio-perez", "perez", "Sergio Pérez", 11, "titular", ["cadillac"], "México", "1990-01-26", "Guadalajara, México", "Empezó a los seis años, en 1996."),
  d("valtteri-bottas", "bottas", "Valtteri Bottas", 77, "titular", ["cadillac"], "Finlandia", "1989-08-28", "Nastola, Finlandia", "Empezó a los seis años. Octavo en la Copa del Mundo de 2005."),

  d("frederik-vesti", "frederik_vesti", "Frederik Vesti", 72, "reserva", ["mercedes"], "Dinamarca", "2002-01-13", "Vejle, Dinamarca", "Compitió de 2012 a 2016. Campeón danés KFJ en 2014."),
  d("antonio-giovinazzi", "giovinazzi", "Antonio Giovinazzi", null, "reserva", ["ferrari"], "Italia", "1993-12-14", "Martina Franca, Italia", "Empezó en 2000 y ganó títulos nacionales e internacionales."),
  d("yuki-tsunoda", "tsunoda", "Yuki Tsunoda", 22, "reserva", ["red-bull", "racing-bulls"], "Japón", "2000-05-11", "Sagamihara, Japón", "Compitió desde 2010 en los campeonatos japoneses de la JAF.", { note: "Corrió para Racing Bulls en las rondas 12 a 14 de 2026." }),
  d("leonardo-fornaroli", "leonardo_fornaroli", "Leonardo Fornaroli", 67, "reserva", ["mclaren"], "Italia", "2004-12-03", "Piacenza, Italia", "Compitió de 2014 a 2019. Tercero en el campeonato italiano de 2018."),
  d("pato-oward", "oward", "Pato O'Ward", null, "reserva", ["mclaren"], "México", "1999-05-06", "Monterrey, México", "Compitió desde fines de 2005 hasta 2012.", { jolpicaId: null }),
  d("ayumu-iwasa", "ayumu_iwasa", "Ayumu Iwasa", 36, "reserva", ["racing-bulls"], "Japón", "2001-09-22", "Moriguchi, Japón", "Empezó en 2005. Ganó el campeonato de Suzuka, clase Yamaha-SS, en 2014."),
  d("paul-aron", "paul_aron", "Paul Aron", 61, "reserva", ["alpine"], "Estonia", "2004-02-04", "Tallin, Estonia", "Empezó a los ocho años. Campeón europeo CIK-FIA júnior en 2018."),
  d("kush-maini", "maini", "Kush Maini", null, "reserva", ["alpine"], "India", "2000-09-22", "Bangalore, India", "", { jolpicaId: null }),
  d("jack-doohan", "doohan", "Jack Doohan", null, "reserva", ["haas"], "Australia", "2003-01-20", "Gold Coast, Australia", "Compitió desde 2012. Campeón australiano en 2015 y 2016."),
  d("ryo-hirakawa", "ryo_hirakawa", "Ryo Hirakawa", 50, "reserva", ["haas"], "Japón", "1994-03-07", "Kure, Japón", "Empezó a los trece años. Campeón japonés júnior en 2008.", { note: "Corrió el GP de México 2026 con Haas en lugar de Esteban Ocon." }),
  d("luke-browning", "luke_browning", "Luke Browning", 46, "reserva", ["williams"], "Reino Unido", "2002-01-31", "Kingsley, Inglaterra", ""),
  d("jak-crawford", "jak_crawford", "Jak Crawford", 34, "reserva", ["aston-martin"], "Estados Unidos", "2005-05-02", "Charlotte, Estados Unidos", "Empezó en 2011. Ganó el SKUSA SuperNationals en 2017."),
  d("stoffel-vandoorne", "vandoorne", "Stoffel Vandoorne", null, "reserva", ["aston-martin"], "Bélgica", "1992-03-26", "Roeselare, Bélgica", "Empezó a los seis años."),
  d("zhou-guanyu", "zhou", "Zhou Guanyu", null, "reserva", ["cadillac"], "China", "1999-05-30", "Shanghái, China", "Empezó a los ocho años. En 2013 ganó el Super 1 National y el Euro Challenge Rotax Max Junior."),
  d("colton-herta", "colton_herta", "Colton Herta", 25, "desarrollo", ["cadillac"], "Estados Unidos", "2000-03-30", "Santa Clarita, Estados Unidos", "Debutó en competencias en 2010, en las series SKUSA e IKF."),
  d("rafael-camara", "rafael_camara", "Rafael Câmara", 51, "reemplazo", ["haas"], "Brasil", "2005-05-05", "Recife, Brasil", "Empezó a los seis años y ganó tres títulos internacionales.", { note: "Debutó con Haas en las rondas 20 y 21 de 2026 en lugar de Esteban Ocon." }),
];

export const getDriver = (slug: string) => drivers.find((x) => x.slug === slug);
export const getDriverByJolpicaId = (id: string) => drivers.find((x) => x.jolpicaId === id);
export const titulares = drivers.filter((x) => x.role === "titular");
export const suplentes = drivers.filter((x) => x.role !== "titular");
