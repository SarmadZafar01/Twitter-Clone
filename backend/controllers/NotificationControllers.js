import Notification from "../model/NotificationModel.js";

export const getNotificataionController = async (req, res) => {
  try {
    const userId = req.user._id;

    const notification = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notification);
  } catch (error) {
    console.log("Error in Notification-controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const deleteNotificataionController = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notification Delete Successfully" });
  } catch (error) {
    console.log("Error in Delete-Notification-controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

// export const deleteNotificataionControllers  = async (req, res) => {
//     try {

//         const notificationid = req.params.id
//         const userId = req.user._id
//         const notification =  await Notification.findById(notificationid)

//         if(!notification){
//             return res.status(200).json({message:  "Notification not found"})

//         }

//         if(notification.to.toString()!== userId.toString()){
//             return res.status(403).json({message:  "You are not authorized to delete this"})
//         }

// await Notification.findByIdAndDelete(notification)
// res.status(200).json({message:  "Notification Delete Successfully"})

//     } catch (error) {
//         console.log("Error in Delete-One-Notification-controller", error.message);
//         res.status(500).json({ error: "internal server error" });
//     }
// }
