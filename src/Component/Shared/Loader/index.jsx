import { Spinner } from "@edx/paragon";
import React, { useEffect } from "react";
// import "./index.css";

const Loader = (props) => {
    useEffect(() => {
        // Scroll to the top if 'hidden' is false
        if (!props.hidden) {
            window.scrollTo(0, 0);
        }

        // Disable or enable page interaction based on 'hidden' value
        document.body.style.overflow = props.hidden ? "auto" : "hidden";

        // Clean up the effect on component unmount
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [props.hidden]);
    const overlayStyle = {
        ...props.style,
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 9999,
    };
    return (
        <div {...props} className="mx-auto text-center" style={overlayStyle}>
            <Spinner animation="border" className="mie-3" screenReaderText="loading" />
        </div>
    );
};

export default Loader;
