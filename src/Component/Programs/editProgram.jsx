import { Container, Form, Col, Button, Dropzone, Tab, Tabs } from '@edx/paragon';
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
            }
        }
        getProgramTypes()
        getCourses()
        getParterns()
        getProgram(uuid)
    }, [])

    const options = []
    const defaultOptions = []
    courses.forEach((value, index) => {
        options.push({ "value": value.id, "label": value.key + ":" + value.title })
        data.courses.forEach((course, i) => {
            if (course.id == value.id) {
                defaultOptions.push({ "value": value.id, "label": value.key + ":" + value.title })
            }
        })
    })
    const updateProgram = (e) => {
        e.preventDefault()
        if (e.target.title.value == "") {
            setErrors({ "title": "This field is required." })
        }
        else if (e.target.subtitle.value == "") {
            setErrors({ "subtitle": "This field is required." })
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
                        setData(res.data)
                        setActiveKey("step_2")
                    }
                })
                .catch((err) => {
                    setErrors(err.response.data)
                })
        }
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

                    {/* <Form.Row>
                        <Form.Group as={Col} controlId="partner">
                            <Form.Label>Partner</Form.Label>
                            <Form.Control name='partner' as="select">
                                <option value="">--------</option>
                                {partners.map((item) => { return (<option value={item.id} selected={item.id == data.partner}>{item.name}</option>) })}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row> */}
                    <div className="d-flex">
                    <Button variant="primary" onClick={()=>{history.goBack()}}>
                            Back
                        </Button>
                        <Button variant="primary" type="submit">
                            Save & Continue
                        </Button>
                    </div>
                </Form>
            </Tab>
            <Tab eventKey="step_2" title="Course Details">
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="banner-image">
                            <Form.Label>Banner Image</Form.Label>
                            <Dropzone
                                onProcessUpload={() => { console.log("select file") }}
                                onUploadCancel={() => console.log('UPLOAD CANCEL')}
                                inputComponent={<p id="fileText">Select file</p>}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="courses">
                            <Form.Label>Courses</Form.Label>
                            <Select name='courses'
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                defaultValue={options[0]}
                                isMulti
                                options={showOption ? options : []}
                                onInputChange={(e) => { e.length > 2 ? setShowOption(true) : setShowOption(false) }}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="marketing-slug">
                            <Form.Label>Marketing Slug</Form.Label>
                            <Form.Control>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="product-source">
                            <Form.Label>Product Source</Form.Label>
                            <Form.Control />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="courses">
                            <Form.Label>Courses</Form.Label>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                defaultValue={[options[0]]}
                                isMulti
                                options={showOption ? options : []}
                                onInputChange={(e) => { e.length > 2 ? setShowOption(true) : setShowOption(false) }}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <Form.Control>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <div className="d-flex">
                        <Button variant="primary" onClick={() => { setActiveKey("step_1") }} >
                            Back
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Tab>
        </Tabs>
    </Container>
    )
};

export default EditProgram;
