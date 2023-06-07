import { useState, useEffect, useRef } from "react";
import NoSsr from "@mui/base/NoSsr";
import Select from "react-select";

import { InputLoading } from "@ui/index";
import customStyles from "./MultiSelectorStyles";
import type { MultiSelectorProps } from "@models/interfaces";

export default function MultiSelector(props: MultiSelectorProps) {
  const [height, setHeight] = useState<number>(0);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!!ref) {
      setHeight(ref.current.offsetHeight);
    }
  }, [ref]);

  return (
    <>
      {!!props.isLoading ? (
        <InputLoading height={`${height}px`} />
      ) : (
        <div ref={ref}>
          <NoSsr>
            <Select
              name={props.name}
              styles={customStyles}
              options={props.options}
              isDisabled={props.isDisabled}
              placeholder={props.placeholder}
              onChange={props.onChange}
              value={props.values}
              hideSelectedOptions={false}
              isOptionSelected={() => false}
              theme={(theme: any) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "#f1f1f1",
                  primary50: "#f1f1f1",
                },
              })}
              isMulti
            />
          </NoSsr>
        </div>
      )}
    </>
  );
}
