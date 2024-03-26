import { Card } from "@edx/paragon";
import image from '../../assets/program.jpeg';
import { useHistory } from "react-router";

const CardData = ({ className, uuid, banner_image, title, ...props }) => {
    const navigate = useHistory()

    return (
        <Card className="cardItem" onClick={() => { navigate.push(`/editDegree/${uuid}`) }}>
            <Card.ImageCap src={banner_image || image} srcAlt="Card image" />
            <Card.Header title={title} />

        </Card>
    )
}

export default CardData;