cron.schedule('* * * * *', async () => {
    try {
      console.log('Cron job triggered at:', new Date());
      await connectToDB();
  
      const adminsToDelete = await Admin.find({
        trashDate: { $ne: null },
        $expr: { $gte: [{ $subtract: [new Date(), '$trashDate'] }, 1000 * 10] }, // 10 seconds
      });
  
      console.log('Admins to delete:', adminsToDelete);
  
      if (adminsToDelete.length > 0) {
        const deletedAdmins = await Admin.deleteMany({
          _id: { $in: adminsToDelete.map((admin) => admin._id) },
        });
        console.log(`${deletedAdmins.deletedCount} admins permanently deleted.`);
      } else {
        console.log('No admins found for deletion.');
      }
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
  