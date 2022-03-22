import app from './server'
import logger from './helpers/logger'

const port = process.env.PORT || 3000
app.listen(port, () => {
    logger.info(`server running at port ${port}`)
})