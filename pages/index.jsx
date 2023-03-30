import React from "react";
import { useState } from "react";
import { getSession, getCsrfToken, signIn } from "next-auth/react";
import Router from "next/router";
import { toast } from "react-toastify";

const index = ({ session, csrfToken }) => {
  const [loding, setLoding] = useState(false);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async () => {
    if (!email || !password) {
      toast.warn("Enter email & Password");
    }
    setLoding(true);
    signIn("credentials", { redirect: false, email, password }).then((data) => {
      if (data.error) {
        alert(data.error);
        setLoding(false);
      } else {
        Router.push("/dashboard");
        setLoding(false);
        toast.success("Login Succesfull");
      }
    });
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type={!show ? "password" : "text"}
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered"
                />
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      id="showPassword"
                      onClick={() => setShow(!show)}
                      className="radio checked:bg-red-500 border-black "
                    />
                    <span className="label-text">Show Password</span>
                  </label>
                </div>
              </div>
              <div className="form-control   mt-6">
                <button
                  onClick={handleSubmit}
                  className={`btn btn-primary ${loding ? "loading" : ""} `}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const csrfToken = await getCsrfToken(context);
  console.log(session);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session, csrfToken },
  };
}

export default index;
