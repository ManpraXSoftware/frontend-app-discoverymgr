import { Chip, CloseButton, Form, Stack } from '@edx/paragon';
import Select from 'react-select';


const CourseTag = (props)=>{
    return (<><Select name='courses'
    isMulti
    onChange={props.TagSelect}
    controlShouldRenderValue={false}
    value={props.defaultTag}
    options={props.showOption ? props.courseOptions : []}
    onInputChange={(e) => { e.length > 2 ? props.setShowOption(true) : props.setShowOption(false) }}
/>
<Stack
    gap={2}
    direction="vertical"
>
    {props.defaultTag.map((course, index) => {
        return (
            <Chip
                onIconAfterClick={(e) => props.removeCourse(e, course)}
                iconAfter={CloseButton}
            >
                {course.label}

            </Chip>
        )
    })}
</Stack></>)
}

export default CourseTag;