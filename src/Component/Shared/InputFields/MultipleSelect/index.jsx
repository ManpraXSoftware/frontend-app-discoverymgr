import { Chip, CloseButton, Stack } from '@edx/paragon';
import { useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types'


const MultipleSelect = ({ name, handleChange, value, options = [], dynamic = false, ...props }) => {
    const [showOption, setShowOption] = useState(false);
    const selectedOptions = value.map(
        (x, index) => {
            let r = options.find(v => v.value === x)
            if (r) return r;
            if (dynamic) {
                return { label: x, value: x }
            }
        }
    ).filter(Boolean)
    const [draftOption, setDraftOption] = useState(undefined)
    const unselect = (e) => {
        value.splice(value.indexOf(e.value), 1);
        handleChange({ target: { name: name, value: value } });
    }
    const selectOption = (e) => {
        handleChange({ target: { name: name, value: e.map(x => x.value) } });
        setDraftOption(undefined);
    }
    const handleInputChange = (e) => {
        const typedValue = e.trim();
        typedValue.trim().length > 2 ? setShowOption(true) : setShowOption(false);

        const draftOptionIndex = options.findIndex(opt => opt.label === draftOption?.label);

        if (dynamic) {
            if (draftOptionIndex !== -1) {
                // Replace the existing draftOption with the updated draftOption
                options[draftOptionIndex] = { label: typedValue, value: typedValue };
                setDraftOption({ label: typedValue, value: typedValue });
            } else {
                // Add the new draftOption to the beginning of the options array
                setDraftOption({ label: typedValue, value: typedValue });
                options.unshift({ label: typedValue, value: typedValue });
            }
        }
    }
    return (<>
        <Select name={name}
            isMulti
            onChange={selectOption}
            controlShouldRenderValue={false}
            value={selectedOptions}
            options={showOption ? options : []}
            onInputChange={handleInputChange}
        />
        <Stack gap={2} direction="vertical" >
            {selectedOptions.map((x, index) => <Chip onIconAfterClick={() => { unselect(x) }} iconAfter={CloseButton} >
                {x.label}
            </Chip>
            )}
        </Stack>
    </>)
}

MultipleSelect.prototypes = {
    name: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
    dynamic: PropTypes.bool,
};

export default MultipleSelect;