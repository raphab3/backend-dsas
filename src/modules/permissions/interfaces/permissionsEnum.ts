export enum PermissionsEnum {
  create_template = 'create_template',
  find_all_templates = 'find_all_templates',
  find_one_template = 'find_one_template',
  update_template = 'update_template',
  remove_template = 'remove_template',
  create_role = 'create_role',
  find_all_roles = 'find_all_roles',
  find_one_role = 'find_one_role',
  update_role = 'update_role',
  remove_role = 'remove_role',
  create_user = 'create_user',
  find_all_users = 'find_all_users',
  find_one_user = 'find_one_user',
  update_user = 'update_user',
  remove_user = 'remove_user',
  reset_user_password = 'reset_user_password',
  create_permission = 'create_permission',
  find_all_permissions = 'find_all_permissions',
  find_one_permission = 'find_one_permission',
  update_permission = 'update_permission',
  remove_permission = 'remove_permission',
  find_all_audits = 'find_all_audits',
  create_appointment = 'create_appointment',
  find_all_appointments = 'find_all_appointments',
  find_one_appointment = 'find_one_appointment',
  update_appointment = 'update_appointment',
  remove_appointment = 'remove_appointment',
  create_patient = 'create_patient',
  find_all_patients = 'find_all_patients',
  find_one_patient = 'find_one_patient',
  update_patient = 'update_patient',
  remove_patient = 'remove_patient',
  create_professional = 'create_professional',
  find_all_professionals = 'find_all_professionals',
  find_one_professional = 'find_one_professional',
  update_professional = 'update_professional',
  remove_professional = 'remove_professional',
  create_specialty = 'create_specialty',
  find_all_specialties = 'find_all_specialties',
  find_one_specialty = 'find_one_specialty',
  update_specialty = 'update_specialty',
  remove_specialty = 'remove_specialty',
  create_dependent = 'create_dependent',
  find_all_dependents = 'find_all_dependents',
  find_one_dependent = 'find_one_dependent',
  update_dependent = 'update_dependent',
  remove_dependent = 'remove_dependent',
  create_personSig = 'create_personSig',
  find_external_personSigs = 'find_external_personSigs',
  find_all_personSigs = 'find_all_personSigs',
  find_one_personSig = 'find_one_personSig',
  update_personSig = 'update_personSig',
  remove_personSig = 'remove_personSig',
  create_asset = 'create_asset',
  find_all_assets = 'find_all_assets',
  find_one_asset = 'find_one_asset',
  update_asset = 'update_asset',
  remove_asset = 'remove_asset',
  create_inventory = 'create_inventory',
  find_all_inventories = 'find_all_inventories',
  find_one_inventory = 'find_one_inventory',
  update_inventory = 'update_inventory',
  remove_inventory = 'remove_inventory',
  auth_sing_in = 'auth_sing_in',
  auth_me = 'auth_me',
  create_location = 'create_location',
  find_all_locations = 'find_all_locations',
  find_one_location = 'find_one_location',
  update_location = 'update_location',
  remove_location = 'remove_location',
  find_all_stats = 'find_all_stats',
}

export const PermissionsEnumList: PermissionsEnum[] = Object.keys(
  PermissionsEnum,
).map((key) => PermissionsEnum[key as keyof typeof PermissionsEnum]);

export type PermissionType = (typeof PermissionsEnumList)[number];

export const groupsOfPermissions = {
  admin: [...PermissionsEnumList],
  user: [PermissionsEnum.auth_sing_in, PermissionsEnum.auth_me],
  manager: [
    PermissionsEnum.create_location,
    PermissionsEnum.remove_location,
    PermissionsEnum.update_location,
  ],
  receptionist: [
    PermissionsEnum.find_external_personSigs,
    PermissionsEnum.create_personSig,
    PermissionsEnum.create_appointment,
    PermissionsEnum.find_all_appointments,
    PermissionsEnum.find_one_appointment,
    PermissionsEnum.update_appointment,
    PermissionsEnum.remove_appointment,
    PermissionsEnum.find_all_patients,
    PermissionsEnum.find_one_patient,
    PermissionsEnum.create_patient,
    PermissionsEnum.update_patient,
    PermissionsEnum.remove_patient,
    PermissionsEnum.create_professional,
    PermissionsEnum.update_professional,
    PermissionsEnum.find_all_professionals,
    PermissionsEnum.find_one_professional,
    PermissionsEnum.find_all_specialties,
    PermissionsEnum.find_one_specialty,
    PermissionsEnum.create_dependent,
    PermissionsEnum.find_all_dependents,
    PermissionsEnum.find_one_dependent,
    PermissionsEnum.update_dependent,
    PermissionsEnum.find_all_personSigs,
    PermissionsEnum.find_one_personSig,
    PermissionsEnum.find_all_locations,
    PermissionsEnum.find_one_location,
  ],
  professional: [
    PermissionsEnum.find_all_appointments,
    PermissionsEnum.find_one_appointment,
    PermissionsEnum.update_appointment,
    PermissionsEnum.find_all_patients,
    PermissionsEnum.find_one_patient,
    PermissionsEnum.update_patient,
    PermissionsEnum.find_all_dependents,
    PermissionsEnum.find_one_dependent,
    PermissionsEnum.update_dependent,
    PermissionsEnum.find_all_personSigs,
    PermissionsEnum.find_one_personSig,
    PermissionsEnum.find_all_locations,
    PermissionsEnum.find_one_location,
  ],
  patient: [
    PermissionsEnum.find_all_appointments,
    PermissionsEnum.find_one_appointment,
  ],
};
