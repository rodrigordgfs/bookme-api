import { registerSchemaBody } from "./registerUserBody.schema.js";
import { loginSchemaBody } from "./loginUserBody.schema.js";
import { patchSchemaBody } from "./patchUserBody.schema.js";
import { postProfessionalSchemaBody } from "./postProfessionalBody.schema.js";
import { patchProfessionalSchemaBody } from "./patchProfessionalBody.schema.js";
import { patchProfessionalSchemaParams } from "./patchProfessionalParams.schema.js";
import { getProfessionalSchemaParams } from "./getProfessionalParams.schema.js";
import { deleteProfessionalSchemaParams } from "./deleteProfessionalParams.schema.js";
import { postServiceSchemaBody } from "./postServiceBody.schema.js";
import { patchServiceSchemaBody } from "./patchServiceBody.schema.js";
import { patchServiceSchemaParams } from "./patchServiceParams.schema.js";
import { deleteServiceSchemaParams } from "./deleteServiceParams.schema.js";
import { postProfessionalServiceSchemaParams } from './postProfessionalServiceParams.schema.js'
import { getProfessionalServiceSchemaParams } from './getProfessionalServiceParams.schema.js'
import { deleteProfessionalServiceSchemaParams } from './deleteProfessionalServiceParams.schema.js'
import { postClientSchemaBody } from './postClientBody.schema.js'
import { patchClientSchemaBody } from './patchClientBody.schema.js'
import { getClientSchemaParams } from './getClientParams.schema.js'
import { deleteClientSchemaParams } from './deleteClientSchemaParams.schema.js'
import { postAppointmentSchemaBody } from './postAppointmentBody.schema.js'
import { patchAppointmentSchemaBody } from './patchAppointmentBody.schema.js'
import { patchAppointmentSchemaParams } from './patchAppointmentParams.schema.js'
import { deleteAppointmentSchemaParams } from './deleteAppointmentParams.schema.js'
import { getAppointmentSchemaParams } from './getAppointmentParams.schema.js'

export {
  registerSchemaBody,
  loginSchemaBody,
  patchSchemaBody,
  postProfessionalSchemaBody,
  patchProfessionalSchemaBody,
  patchProfessionalSchemaParams,
  getProfessionalSchemaParams,
  deleteProfessionalSchemaParams,
  postServiceSchemaBody,
  patchServiceSchemaBody,
  deleteServiceSchemaParams,
  patchServiceSchemaParams,
  postProfessionalServiceSchemaParams,
  getProfessionalServiceSchemaParams,
  deleteProfessionalServiceSchemaParams,
  postClientSchemaBody,
  patchClientSchemaBody,
  getClientSchemaParams,
  deleteClientSchemaParams,
  postAppointmentSchemaBody,
  patchAppointmentSchemaBody,
  patchAppointmentSchemaParams,
  deleteAppointmentSchemaParams,
  getAppointmentSchemaParams
};
