import React from 'react';
import { useParams } from 'react-router-dom';

const ProfileRouting = () => {
    const { id } = useParams();
    let content;
    if (id === "me") {
        content = <div>Page1</div>;
    } else {
        content = <div>Page2</div>;
    }
    console.log(content);
    return (
        <div>
            <h1>
                {content}
            </h1>
        </div>
    );
}

export default ProfileRouting;
