import React, { useRef } from 'react'
import { Button, FilledInput, InputAdornment, } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import AccountCircle from '@material-ui/icons/AccountCircle';
interface Props {
    isConnected: boolean;
    members: string[];
    chatRows: React.ReactNode[];
    onPublicMessage: (msg:any) => void;
    onConnect: () => void;
    onDisconnect: () => void;
}

export const ChatClient = (props: Props) => {
    const msgText = useRef<HTMLInputElement>(null);
    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#f4ede3',
            display: 'flex',
            alignItems: 'center',
        }}>
            <CssBaseline />
            <Container maxWidth="lg" style={{ height: '90%' }}>
                <Grid container style={{ height: '100%' }}>
                    <Grid item xs={2} style={{ backgroundColor: '#3281a8', color: 'white' }}>
                        <List component="nav">
                            {props.members.map(item =>
                                <ListItem key={item} button>
                                    <ListItemText style={{ fontWeight: 800 }} primary={item} />
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                    <Grid style={{ position: 'relative' }} item container direction="column" xs={10} >
                        <Paper style={{ flex: 1 }}>
                            <Grid item container style={{ height: '100%' }} direction="column">
                                <Grid item container style={{ flex: 1 }}>
                                    <ul style={{
                                        paddingTop: 20,
                                        paddingLeft: 44,
                                        listStyleType: 'none',
                                    }}>
                                        {props.chatRows.map((item, i) =>
                                            <li key={i} style={{ paddingBottom: 9 }}>{item}</li>
                                        )}
                                    </ul>
                                </Grid>
                                <Grid item style={{ margin: 10 }}>
                                    {props.isConnected && <div style={{ marginBottom: 15 }}> 
                                    <FilledInput ref={msgText} id="outlined-basic" autoComplete="off" fullWidth startAdornment={
                                        <InputAdornment position="start" style={{ marginBottom: -5 }}>
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                          props.onPublicMessage((event.target as HTMLInputElement).value);
                                          (event.target as HTMLInputElement).value = "";
                                        }
                                      }}
                                     /></div>}
                                    {props.isConnected && <Button style={{ marginRight: 7 }} variant="outlined" size="small" disableElevation onClick={event =>{ props.onPublicMessage((msgText?.current?.childNodes[1] as HTMLInputElement)?.value);(msgText?.current?.childNodes[1] as HTMLInputElement).value = ""; } }>Send Message</Button>}
                                    {props.isConnected && <Button variant="outlined" size="small" disableElevation onClick={props.onDisconnect}>Disconnect</Button>}
                                    {!props.isConnected && <Button variant="outlined" size="small" disableElevation onClick={props.onConnect}>Connect</Button>}
                                </Grid>
                            </Grid>
                            <div style={{
                                position: 'absolute',
                                right: 9,
                                top: 8,
                                width: 12,
                                height: 12,
                                backgroundColor: props.isConnected ? '#00da00' : '#e2e2e2',
                                borderRadius: 50,
                            }} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div >
    )
};