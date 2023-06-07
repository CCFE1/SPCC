const customStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    background: "#fafafa",
    borderColor: "#dcdcdc",
    minHeight: "4.9vh",
    height: "4.9vh",
    border: "1px solid #dcdcdc",
    borderRadius: "4.9px",
    boxShadow: state.isFocused ? null : null,
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    padding: "0 6px",
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    minHeight: "4.9vh",
    height: "4.9vh",
  }),
};

export default customStyles;
