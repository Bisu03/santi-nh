import { getSession } from "next-auth/react";
import Admission from "../../models/Admission";
// import Spent from "../../models/spent";
import connectDB from "../../lib/connectDb";
connectDB();

export default async (req, res) => {
  try {
    const session = await getSession({ req });
    if (session) {
      // { $gte: req.query.fromdate, $lte: req.query.todate }
      // console.log(req.query);
      const getadmission = await Admission.find({
        dateOfAdmission: { $gte: req.query.fromdate, $lte: req.query.todate },
        isDeleted: false,
      })
        .sort({
          createdAt: -1,
        })
        .populate({
          path: "patient",
        })
        .populate({
          path: "billing",
        });
      const getdeparture = await Admission.find({
        dateOfDeparture: { $gte: req.query.fromdate, $lte: req.query.todate },
        isDeleted: false,
      })
        .sort({
          createdAt: -1,
        })
        .populate({
          path: "patient",
        })
        .populate({
          path: "billing",
        });

      // const getspent = await Spent.find({ dateOfEnter: { $gte: req.query.fromdate, $lte: req.query.todate } }).sort({
      //     createdAt: -1,
      // })

      return res.status(200).json({ getadmission, getdeparture });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
