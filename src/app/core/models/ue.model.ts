export type Semestre = 'S1' | 'S2';

export interface UE {
  id: string;
  nom: string;
  code: string;
  semestre: Semestre;
}
