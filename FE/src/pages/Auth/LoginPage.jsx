export const LoginPage = () => {
    return(
        <>
        <div className="login">
            <div className="form">
                <h2 classNam="title">Login</h2>
                <form action="">
                    <input type="email" name="email" placeholder="Email" required/>
                    <input type="password" name="password" placeholder="Password" required/>
                    <input type="checkbox" name="remember" id="remember"/>
                    <label for="remember">Remember me</label>
                    <button type="submit">Login</button>
                </form>
            </div>
            </div>
        </>
    )
}