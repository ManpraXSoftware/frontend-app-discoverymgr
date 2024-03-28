import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Chip, CloseButton, Stack } from '@edx/paragon';
import { useEffect, useState } from 'react';
import Select from 'react-select';


const TagSelect = (props) => {
    const [showOption, setShowOption] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([])
    useEffect(()=>{
        setSelectedOptions(props.options.map((value, index)=> props.data.includes(value.value) && value).filter(Boolean))
    },[props.options])

    const removeCourse = (e, data) => {
        let new_data = [...selectedOptions]
        let index = selectedOptions.indexOf(data)
        new_data.splice(index, 1);
        setSelectedOptions(new_data)
    }

    const selectOptions =(data)=>{
        setSelectedOptions(data)
    }

    async function createTag(e) {
        e.persist();
        if (props.name=="labels" && e.key == "Enter" && e.target.value != "") {
            e.preventDefault()
            const data = {
                "name": e.target.value,
                "slug": e.target.value.toLowerCase().replace(" ", "_")
            }
            const response = await getAuthenticatedHttpClient().post(process.env.DISCOVERY_BASE_URL + `/api/v1/tags/`, data);
            if (response.status == 201) {
                setSelectedOptions(selectedOptions => [...selectedOptions, { "value": response.data.id, "label": response.data.name }])
            }
            e.target.value = ''
        }
    }


    return (<><Select name={props.name}
        isMulti
        onChange={selectOptions}
        controlShouldRenderValue={false}
        value={selectedOptions}
        options={showOption ? props.options : []}
        onInputChange={(e) => { e.length > 2 ? setShowOption(true) : setShowOption(false) }}
        onKeyDown={(e)=>{createTag(e)}}
    />
        <Stack
            gap={2}
            direction="vertical"
        >
            {selectedOptions.map((tag, index) => {
                return (
                    <Chip
                        onIconAfterClick={(e) => removeCourse(e, tag)}
                        iconAfter={CloseButton}
                    >
                        {tag.label}

                    </Chip>
                )
            })}
        </Stack></>)
}

export default TagSelect;