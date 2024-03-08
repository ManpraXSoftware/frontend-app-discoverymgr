import { Container, Form, Col, Button, Tab, Tabs, Stack, Chip, CloseButton, Toast } from '@edx/paragon';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const EditProgram = () => {
    const location = useLocation()
    const [data, setData] = useState({})
    const [types, setTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const animatedComponents = makeAnimated();
    const [showOption, setShowOption] = useState(false);
    const [partners, setPartners] = useState([])
    const [activeKey, setActiveKey] = useState('step_1')
    const [errors, setErrors] = useState({})
    const uuid = location.pathname.split("/")[location.pathname.split("/").length - 1]
    const history = useHistory()
    const [tags, setTags] = useState([])
    const [defaultCourses, setDefaultCourses] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const [defaultTags, setDefaultTags] = useState([])
    const [show, setShow] = useState(false)

    useEffect(() => {
        async function getProgramTypes() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + '/api/v1/program_types');
            if (response.status == 200) {
                const response_data = response.data.results
                setTypes(response_data)
            }
        }
        async function getCourses() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + '/api/v1/courses');
            if (response.status == 200) {
                const response_data = response.data.results
                loadOptions(response.data.results)
                setCourses(response_data)
            }
        }
        async function getParterns() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + '/api/v1/partners');
            if (response.status == 200) {
                const response_data = response.data.results
                setPartners(response_data)
            }
        }
        async function getProgram(uuid) {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/v1/program_data/${uuid}`);
            if (response.status == 200) {
                const response_data = response.data
                setData(response_data)
                updateDefaultCourses(response.data)
                updateTagOptions(response.data)
            }
        }
        async function getTag() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/v1/tags/`);
            if (response.status == 200) {
                const response_data = response.data
                setTags(response_data)
            }
        }

        getProgramTypes()
        getCourses()
        getParterns()
        getProgram(uuid)
        getTag()
    }, [])

    const loadOptions = (data) => {
        const courseOptions = []
        data.forEach((value, index) => {
            courseOptions.push({ "value": value.id, "label": value.key + ":" + value.title })
        })
        setCourseOptions(courseOptions)
    }
    const updateDefaultCourses = (program) => {
        const courseOptions = []
        if (program.courses) {
            program.courses.forEach((program_course, index) => {
                courseOptions.push({ "value": program_course.id, "label": program_course.key + ":" + program_course.title })
            })

        }
        setDefaultCourses(courseOptions)
    }

    const updateTagOptions = (program) => {
        const tags = []
        if (program.labels) {
            program.labels.forEach((program_tag, index) => {
                tags.push({ "value": program_tag.id, "label": program_tag.name })
            })
        }
        setDefaultTags(tags)
    }

    const tagOptions = []
    tags.forEach((value, index) => {
        tagOptions.push({ "value": value.id, "label": value.name })
    })
    const updateProgram = (e) => {
        e.preventDefault()
        if (e.target.title.value == "") {
            setErrors({ "title": "This field is required." })
        }
        else if (e.target.status.value == "") {
            setErrors({ "status": "This field is required." })
        }
        else if (e.target.type.value == "") {
            setErrors({ "type": "This field is required." })
        }
        else {
            const form_data = new FormData(e.target)
            getAuthenticatedHttpClient().patch(process.env.DISCOVERY_BASE_URL + `/api/v1/program_data/${data.id}/`, form_data).then(
                (res) => {
                    if (res.status == 200) {
                        setShow(true)
                        setData(res.data)
                        setActiveKey("step_2")
                    }
                })
                .catch((err) => {
                    setErrors(err.response.data)
                })
        }
    }

    const updateProgram2 = (e) => {
        e.preventDefault()
        if (e.target.title.courses == "" || defaultCourses == []) {
            setErrors({ "courses": "This field is required." })
        }
        else {
            const form_data = new FormData(e.target)
            getAuthenticatedHttpClient().patch(process.env.DISCOVERY_BASE_URL + `/api/v1/program_data/${data.id}/`, form_data).then(
                (res) => {
                    if (res.status == 200) {
                        setShow(true)
                        setData(res.data)
                        setActiveKey("step_2")
                    }
                })
                .catch((err) => {
                    setErrors(err.response.data)
                })
        }
    }

    const courseSelect = (data) => {
        setDefaultCourses(data)
    }

    const removeCourse = (e, data) => {
        let new_data = [...defaultCourses]
        let index = defaultCourses.indexOf(data)
        if (index >= -1) {
            new_data.splice(index, 1);
        }
        setDefaultCourses(new_data)
    }

    const selectTag = (data) => {
        setDefaultTags(data)
    }

    const removeTag = (e, data) => {
        let new_data = [...defaultTags]
        let index = defaultTags.indexOf(data)
        if (index >= -1) {
            new_data.splice(index, 1);
        }
        setDefaultTags(new_data)
    }


    return (<Container className="col-10">
        <h2>Edit Program</h2>
        <Tabs
            variant="tabs"
            activeKey={activeKey}
            id="uncontrolled-tab-example"
            onSelect={(k) => setActiveKey(k)}
        >
            <Tab eventKey="step_1" title="Program Details">
                <Form onSubmit={updateProgram}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name='title' defaultValue={data.title} type="text" placeholder="Enter Program Title" />
                            {errors.title ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.title}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>

                        <Form.Group as={Col} controlId="subtitle">
                            <Form.Label>Subtitle</Form.Label>
                            <Form.Control defaultValue={data.subtitle} name='subtitle' type="text" placeholder="Enter Program Subtitle" />
                            {errors.subtitle ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.subtitle}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control name='status' as="select">
                                <option value="unpublished" selected={data.status == "unpublished"}>Unpublished</option>
                                <option value="active" selected={data.status == "active"}>Active</option>
                                <option value="retired" selected={data.status == "retired"}>Retired</option>
                                <option value="deleted" selected={data.status == "deleted"}>Deleted</option>
                            </Form.Control>
                            {errors.status ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.status}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>

                        <Form.Group as={Col} controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control name='type' as="select">
                                <option value="">--------</option>
                                {types.map((item) => { return (<option value={item.id} selected={data.type != null ? item.id == data.type.id : false}>{item.name}</option>) })}
                            </Form.Control>
                            {errors.status ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.status}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>
                    </Form.Row>
                    <div className="d-flex">
                        <Button variant="primary" className='back-btn' onClick={() => { history.goBack() }}>
                            Back
                        </Button>
                        <Button variant="primary" type="submit">
                            Save & Continue
                        </Button>
                    </div>
                </Form>
            </Tab>
            <Tab eventKey="step_2" title="Course Details">
                <Form onSubmit={updateProgram2}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="banner-image">
                            <Form.Label>Banner Image</Form.Label>
                            <Form.Control className='banner-image' defaultValue={data.banner_image} name='banner_image' type='file'></Form.Control>
                            {data.banner_image?<a href={data.banner_image} target='_blank'>Click here to view banner image</a>:""}
                        </Form.Group>
                        <Form.Group as={Col} controlId="tags" className='col-6'>
                            <Form.Label>Tags</Form.Label>
                            <Select name='labels'
                                controlShouldRenderValue={false}
                                onChange={selectTag}
                                components={animatedComponents}
                                value={defaultTags}
                                isMulti
                                options={tagOptions}
                            />
                            <Stack
                                gap={2}
                                direction="horizontal"
                                className="horizontal-tag"
                            >
                                {defaultTags.map((tag, index) => {
                                    return (
                                       <Chip
                                            onIconAfterClick={(e) => removeTag(e, tag)}
                                            iconAfter={CloseButton}
                                        >
                                            {tag.label}

                                        </Chip>
                                    )
                                })}
                            </Stack>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="courses">
                            <Form.Label>Courses</Form.Label>
                            <Select name='courses'
                                isMulti
                                onChange={courseSelect}
                                controlShouldRenderValue={false}
                                value={defaultCourses}
                                options={showOption ? courseOptions : []}
                                onInputChange={(e) => { e.length > 2 ? setShowOption(true) : setShowOption(false) }}
                            />
                            <Stack
                                gap={2}
                                direction="vertical"
                            >
                                {defaultCourses.map((course, index) => {
                                    return (
                                        <Chip
                                            onIconAfterClick={(e) => removeCourse(e, course)}
                                            iconAfter={CloseButton}
                                        >
                                            {course.label}

                                        </Chip>
                                    )
                                })}
                            </Stack>

                        </Form.Group>

                    </Form.Row>
                    <div className="d-flex">
                        <Button variant="primary" className='back-btn' onClick={() => { setActiveKey("step_1") }} >
                            Back
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Tab>
        </Tabs>
        <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={2000}
      >
        Program Updated.
      </Toast>
    </Container>
    )
};

export default EditProgram;
