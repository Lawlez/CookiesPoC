import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            margin: 0,
        },
    },
    papier: {
        padding: theme.spacing(8),
        minWidth: 450,
        maxWidth: 550,
        minHeight: 380,
        '& h1': {
            color: '#1b375c',
        },
    },
    actions: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    Icons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
    },
    form: {
        paddingTop: theme.spacing(8),
    },
    welcomeText: {
        paddingTop: theme.spacing(4),
    },
    help: {
        marginTop: -24,
        display: 'flex',
        position: 'relative',
        flexDirection: 'row-reverse',
        right: -24,
    },
    centered: {
        margin: 'auto',
        width: '72%',
    },
    logo: {
        marginTop: theme.spacing(4),
    },
    copyright: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row-reverse',
        bottom: -theme.spacing(12),
        right: -theme.spacing(8),
    },
    particles: {
        width: '100vw',
        height: '100vh',
    },
}))

export default useStyles
