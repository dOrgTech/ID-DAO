// TODO:
// - Identity Definition Form
// - Registry.removeSelf
// - Registry.isHuman
// - Generic Actions (add, remove, update)
// - DAO.proposeAdd (use action templates)
// - DAO.proposeRemove
// - DAO.proposeUpdate
// - Subgraph Querying

/*
import { IdentityDefinitionForm } from "@dorgtech/id-dao-client";

const form = new IdentityDefinitionForm();

form.$.name.value = "Bob";
form.validate();
form.data;
*/

export {
  IdentityDefinition,
  IdentityDefinitionForm
} from "./IdentityDefinition";
