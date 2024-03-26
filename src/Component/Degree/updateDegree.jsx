import { Container, Form, Col, Button, Tab, Tabs, Stack, Chip, CloseButton, Toast } from '@edx/paragon';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import Curriculums from '../Curriculum/curriculums';
import Quickfacts from '../QuickFacts/quickfacts';
import "./degrees.css"

const UpdateDegree = () => {
    const location = useLocation()
    const [data, setData] = useState({})
    const [types, setTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const animatedComponents = makeAnimated();
    const [showOption, setShowOption] = useState(false);
    const [activeKey, setActiveKey] = useState('step_1')
    const [errors, setErrors] = useState({})
    const uuid = location.pathname.split("/")[location.pathname.split("/").length - 1]
    const history = useHistory()
    const [tags, setTags] = useState([])
    const [defaultCourses, setDefaultCourses] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const [defaultTags, setDefaultTags] = useState([])
    const [show, setShow] = useState(false)
    const [bannerImage, setBannerImage] = useState(null)
    const [cardImage, setCardImage] = useState(null)
    const [curriculums, setCurriculums] = useState([])
    const [quickfacts, setQuickfacts] = useState([])
    const hiddenCardImageInput = useRef(null)
    const hiddenBannerImageInput = useRef(null)

    async function getCurriculums(degree) {
        const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/mx/curriculums/?degree=${degree}`)
        if (response.status == 200) {
            setCurriculums(response.data)
        }
    }

    async function getQuickfacts(degree) {
        const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/mx/quickfacts/?degree=${degree}`)
        if (response.status == 200) {
            setQuickfacts(response.data)
        }
    }

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
        async function getDegree(uuid) {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/mx/degree/${uuid}`);
            if (response.status == 200) {
                const response_data = response.data
                setData(response_data)
                updateDefaultCourses(response.data)
                updateTagOptions(response.data)
                getCurriculums(response.data.id)
                getQuickfacts(response.data.id)
            }
        }
        async function getTag() {
            const response = await getAuthenticatedHttpClient().get(process.env.DISCOVERY_BASE_URL + `/api/mx/tags/`);
            if (response.status == 200) {
                const response_data = response.data
                setTags(response_data)
            }
        }

        getProgramTypes()
        getCourses()
        getDegree(uuid)
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

    const handleBannerChange = (e) => {
        setBannerImage(e.target.files[0])
    }

    const handleCardImage = (e) => {
        setCardImage(e.target.files[0])
    }

    const updateDegree = (e) => {
        e.preventDefault()
        if (e.target.title.value == "") {
            setErrors({ "title": "This field is required." })
        }
        else if (e.target.type.value == "") {
            setErrors({ "type": "This field is required." })
        }
        else {
            const form_data = new FormData(e.target)
            if (bannerImage != null) {
                form_data.append('banner_image', bannerImage)
            }
            if (cardImage != null) {
                form_data.append('card_image', cardImage)
            }
            getAuthenticatedHttpClient().patch(process.env.DISCOVERY_BASE_URL + `/api/mx/degree/${data.id}/`, form_data).then(
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

    const updateDegree2 = (e) => {
        e.preventDefault()
        if (e.target.courses.value == "" || defaultCourses == []) {
            // setErrors({ "courses": "This field is required." })
            setActiveKey("step_3")
        }
        else {
            const form_data = new FormData(e.target)
            getAuthenticatedHttpClient().patch(process.env.DISCOVERY_BASE_URL + `/api/mx/degree/${data.id}/`, form_data).then(
                (res) => {
                    if (res.status == 200) {
                        setShow(true)
                        setData(res.data)
                        setActiveKey("step_3")
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


    async function createTag(e) {
        e.persist();
        if (e.key == "Enter" && e.target.value != "") {
            e.preventDefault()
            const data = {
                "name": e.target.value,
                "slug": e.target.value.toLowerCase().replace(" ", "_")
            }
            const response = await getAuthenticatedHttpClient().post(process.env.DISCOVERY_BASE_URL + `/api/mx/tags/`, data);
            if (response.status == 201) {
                setDefaultTags(defaultTags => [...defaultTags, { "value": response.data.id, "label": response.data.name }])
            }
            e.target.value = ''
        }
    }

    const removedCardImage = (id, fieldName) => {
        const form_data = new FormData()
        form_data.append(fieldName, '')
        getAuthenticatedHttpClient().patch(process.env.DISCOVERY_BASE_URL + `/api/mx/degree/${id}/`, form_data).then(
            (res) => {
                if (res.status == 200) {
                    if (fieldName == "card_image") {
                        hiddenCardImageInput.current.value = null;
                        setCardImage(null)
                    }
                    else {
                        hiddenBannerImageInput.current.value = null;
                        setBannerImage(null)
                    }
                    setShow(true)
                    setData(res.data)
                }
            })
            .catch((err) => {
                setErrors(err.response)
            })
    }

    return (<Container className="col-10">
        <h2>Edit Degree</h2>
        <Tabs
            variant="pills"
            activeKey={activeKey}
            id="uncontrolled-tab-example"
            onSelect={(k) => setActiveKey(k)}
        >
            <Tab eventKey="step_1" title="Program Details">
                <Form id="update-form" onSubmit={updateDegree}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="title">
                            <Form.Label>Title*</Form.Label>
                            <Form.Control flo name='title' defaultValue={data.title} type="text" placeholder="Enter Degree Title" />
                            {errors.title ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.title}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="subtitle">
                            <Form.Label>Subtitle</Form.Label>
                            <Form.Control defaultValue={data.subtitle} name='subtitle' type="text" placeholder="Enter Degree Subtitle" />
                            {errors.subtitle ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.subtitle}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="type">
                            <Form.Label>Type*</Form.Label>
                            <Form.Control name='type' as="select">
                                <option value="">--------</option>
                                {types.map((item) => { return (<option value={item.id} selected={data.type != null ? item.id == data.type.id : false}>{item.name}</option>) })}
                            </Form.Control>
                            {errors.type ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.type}
                                </Form.Control.Feedback> : ""}
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
                                onKeyDown={(e) => { createTag(e) }}
                            />
                            {errors.labels ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.labels}
                                </Form.Control.Feedback> : ""}
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
                        <Form.Group as={Col} controlId="banner-image">
                            <Form.Label>Banner Image</Form.Label>
                            <Form.Control className='banner-image' ref={hiddenBannerImageInput} onChange={handleBannerChange} type='file'></Form.Control>
                            {data.banner_image ? <div className="d-flex image-remove"><a href={data.banner_image} target='_blank'>Click here to view banner image</a> <p className='removeBtn' onClick={() => { removedCardImage(data.id, "banner_image") }}>Remove Image</p></div> : ""}
                            {errors.banner_image ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.banner_image}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>
                        <Form.Group as={Col} controlId="banner-image">
                            <Form.Label>Card Image</Form.Label>
                            <Form.Control className='banner-image' ref={hiddenCardImageInput} onChange={handleCardImage} type='file'></Form.Control>
                            {data.card_image ? <div className="d-flex image-remove"><a href={data.card_image} target='_blank'>Click here to view Card image</a><p className='removeBtn' onClick={() => { removedCardImage(data.id, "card_image") }}>Remove Image</p></div> : ""}
                            {errors.card_image ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.card_image}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>


                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="overview">
                            <Form.Label>Overview</Form.Label>
                            <Form.Control name='overview' as="textarea" defaultValue={data.overview} placeholder="Enter Degree Overview" />
                            {errors.overview ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.overview}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>

                        <Form.Group as={Col} controlId="subtitle">
                            <Form.Label>Video</Form.Label>
                            <Form.Control name='video_url' defaultValue={data.video ? data.video.src : ""} type='url' placeholder='Enter video url'>
                            </Form.Control>
                            {errors.video ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.video}
                                </Form.Control.Feedback> : ""}
                        </Form.Group>
                    </Form.Row>
                    <div className="d-flex continue-btn">
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
                <Form onSubmit={updateDegree2}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="courses">
                            <Form.Label>Courses*</Form.Label>
                            <Select name='courses'
                                isMulti
                                onChange={courseSelect}
                                controlShouldRenderValue={false}
                                value={defaultCourses}
                                options={showOption ? courseOptions : []}
                                onInputChange={(e) => { e.length > 2 ? setShowOption(true) : setShowOption(false) }}
                            />
                            {errors.courses ?
                                <Form.Control.Feedback type="invalid">
                                    {errors.courses}
                                </Form.Control.Feedback> : ""}
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
                    <div className="d-flex continue-btn">
                        <Button variant="primary" className='back-btn' onClick={() => { setActiveKey("step_1") }} >
                            Back
                        </Button>
                        <Button variant="primary" type="submit">
                            Save & Continue
                        </Button>
                    </div>
                </Form>
            </Tab>
            <Tab eventKey="step_3" title="Curriculums & Qucik Facts">
                <h4>Curriculums</h4>
                <Curriculums degree={data.id} data={curriculums} get_data={getCurriculums} />
                <br></br>
                <h4>Quick Facts</h4>
                <Quickfacts degree={data.id} data={quickfacts} get_data={getQuickfacts} />
            </Tab>
        </Tabs>
        <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={2000}
        >
            Degree Updated.
        </Toast>
    </Container>
    )
};

export default UpdateDegree;
