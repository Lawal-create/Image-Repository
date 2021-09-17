interface ISchemaDefault {
  type:
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | DateConstructor
    | StringConstructor[];
  default: null | string | number | Date | boolean;
}

const getTypeAndDefaultValue = (
  type:
    | StringConstructor
    | NumberConstructor
    | DateConstructor
    | BooleanConstructor
    | StringConstructor[],
  defaultValue: null | string | number | Date | boolean
): ISchemaDefault => {
  return {
    type,
    default: defaultValue
  };
};

export default getTypeAndDefaultValue;
