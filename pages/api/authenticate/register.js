export default function handler(req, res) {
    console.log(req.body);
    if (req.method !== 'POST') {
        return res.status(400).json({status: 'error'});
    }
    res.status(200).json({status: 'success'});
}