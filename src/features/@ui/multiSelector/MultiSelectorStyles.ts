const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    background: "#fafafa",
    borderColor: "#d1d1d1",
    minHeight: "4.5vh",
    border: "1px solid #d1d1d1",
    borderRadius: "4px",
    boxShadow: state.isFocused ? null : null,
    fontSize: "16px",
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    minHeight: "30px",
    padding: "0 6px",
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: (state: any) => ({
    display: "none",
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    display: "none",
  }),
};

export default customStyles;
