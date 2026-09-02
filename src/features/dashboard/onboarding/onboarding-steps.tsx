import { defineStepper } from "@stepperize/react";
import { FaUser, FaStore } from "react-icons/fa6";

export const { Scoped, useStepper } = defineStepper(
  { id: "profile", title: "Seu Perfil", description: "Como suas Poderosas vão te identificar", icon: <FaUser /> },
  { id: "establishment", title: "Seu Espaço", description: "Configure os detalhes do seu espaço de atendimento", icon: <FaStore /> }
);
