export default (req, res) => {
    console.log('user api ',arguments);
    console.log(res);
 //   res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ name: 'John Doe' }))
}