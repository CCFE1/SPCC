import NoSsr from '@mui/base/NoSsr';
import CreatableSelect from "react-select/creatable";

export const CreatableAdapter = ({ input, innerRef, ...rest }: any) => {
  return (
     <NoSsr>
      <CreatableSelect
        {...input}
        {...rest}
        onInputChange={(inputValue: any) =>
          inputValue.length <= rest.maxLength
            ? inputValue.toUpperCase()
            : inputValue.substr(0, rest.maxLength).toUpperCase()
        }
        searchable
      />
     </NoSsr>
  );
};
