import React from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";

const GameMatching = () => {

    const images = [
        {
            url: '',
            title: 'Random Match',
            width: '100%',
        },
        {
            url: '/static/images/buttons/burgers.jpg',
            title: 'Inviter',
            width: '100%',
        },
        {
            url: '/static/images/buttons/camera.jpg',
            title: 'Participant',
            width: '100%',
        },
        {
            url: '/static/images/buttons/camera.jpg',
            title: 'Observer',
            width: '100%',
        }
    ];

    const ImageButton = styled(ButtonBase)(({ theme }) => ({
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('sm')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &.Mui-focusVisible': {
            zIndex: 1,
            '& .MuiImageBackdrop-root': {
                opacity: 0.15,
            },
            '& .MuiImageMarked-root': {
                opacity: 0,
            },
            '& .MuiTypography-root': {
                border: '4px solid currentColor',
            },
        },
    }));

    const ImageSrc = styled('span')({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    });

    const Image = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    }));

    const ImageBackdrop = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    }));

    const ImageMarked = styled('span')(({ theme }) => ({
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    }));

    const navigate = useNavigate();

    const pageRedirect = (type:string) => {

        let url = '';

        if (type === 'Random Match') {
            url = '/game/game_room/'
        } else if (type === 'Inviter') {
            url = '/game/invite_room/'

        } else if (type === 'Participant') {
            url = 'join_invited_room';
        } else if (type === 'Observer') {
            url = '/game/select_room';
        }
        navigate(url);
    };

        return (
            <div
                style={{ backgroundColor: "#EDF0F4",
                    minHeight: "100vh"
                }}
            >
            <h1>[select room]</h1>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
                <Grid container direction={"column"}>
                {images.map((image) => (
                    <Grid item xs margin={2} key={image.title}>
                    <ImageButton
                        focusRipple
                        key={image.title}
                        style={{
                            width: image.width,
                        }}
                        onClick={() => pageRedirect(image.title)}
                    >
                        <ImageSrc style={{ backgroundImage: `url(${image.url})` }}/>
                        <ImageBackdrop className="MuiImageBackdrop-root" />
                        <Image>
                            <Typography
                                component="span"
                                variant="subtitle1"
                                color="inherit"
                                sx={{
                                    position: 'relative',
                                    p: 4,
                                    pt: 2,
                                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                                    fontSize: 80
                                }}
                            >
                                {image.title}
                                <ImageMarked className="MuiImageMarked-root" />
                            </Typography>
                        </Image>
                    </ImageButton>
                    </Grid>
                ))}
                </Grid>
            </Box>
            </div>
        );
}





// const GameMatching = () => (
//         <div>
//             <h1>[Matching Page]</h1>
//
//             <h1>
//             <p></p>
//             <Link to={"/game/game_room"}>Random Match</Link>
//             <p></p>
//             <Link to={"/game/invite_room"}>Invite Someone</Link>
//             <p></p>
//             <Link to={"/game/join_invited_room"}>Join Invited room</Link>
//             <p></p>
//             <Link to={"/game/select_room"}>Observer</Link>
//             </h1>
//
//         </div>
//     )

export default GameMatching;
