import type { ReactNode } from "react";
import type { HumanStoryMotif } from "../../data/human-stories";
import { BuilderVector } from "./BuilderVector";
import type { CharacterVectorProps } from "./CharacterParts";
import { CreatorVector } from "./CreatorVector";
import { DreamerVector } from "./DreamerVector";
import { FarmerVector } from "./FarmerVector";
import { GuardianVector } from "./GuardianVector";
import { TeacherVector } from "./TeacherVector";

const characterVectors: Record<HumanStoryMotif, (props: CharacterVectorProps) => ReactNode> = {
  teacher: TeacherVector,
  farmer: FarmerVector,
  builder: BuilderVector,
  creator: CreatorVector,
  guardian: GuardianVector,
  dreamer: DreamerVector,
};

export function CharacterVector({ motif, ...props }: CharacterVectorProps & { motif: HumanStoryMotif }) {
  const Vector = characterVectors[motif];
  return <Vector {...props} />;
}
