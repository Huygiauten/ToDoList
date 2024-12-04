function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming req.user is populated after authentication

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
}

module.exports = authorizeRoles;