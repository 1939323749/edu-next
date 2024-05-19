import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {


	// 创建学生1
	await prisma.student.create({
		data: {
			name: "alice",
			sex: "f",
			email: "alice@example.com",
			birthday: new Date("2002-01-01").toISOString(),
			enrolled_time: new Date("2021-09-01").toISOString(),
			classId:
				(await prisma.class
					.findFirst({
						where: {
							name: "class1",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.class
					.create({
						data: {
							name: "class1",
						},
					})
					.then((data) => data.id)),
			majorId:
				(await prisma.major
					.findFirst({
						where: {
							name: "major1",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.major
					.create({
						data: {
							name: "major1",
                            departments: {
                                connect: {
                                    id: await prisma.department.findFirst({
                                        where: {
                                            name: "department1",
                                        },
                                        select: {
                                            id: true,
                                        },
                                    }).then((data) => data?.id) ?? await prisma.department.create({
                                        data: {
                                            name: "department1",
                                        },
                                    }).then((data) => data.id),
                                }
                            }
						},
					})
					.then((data) => data.id)),
		},
	});
	// 创建学生2
	await prisma.student.create({
		data: {
			name: "bob",
			sex: "m",
			email: "bob@example.com",
			birthday: new Date("2002-01-01").toISOString(),
			enrolled_time: new Date("2021-09-01").toISOString(),
			classId:
				(await prisma.class
					.findFirst({
						where: {
							name: "class2",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.class
					.create({
						data: {
							name: "class2",
						},
					})
					.then((data) => data.id)),
			majorId:
				(await prisma.major
					.findFirst({
						where: {
							name: "major1",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.major
					.create({
						data: {
							name: "major1",
                            departments: {
                                connect: {
                                    id: await prisma.department.findFirst({
                                        where: {
                                            name: "department1",
                                        },
                                        select: {
                                            id: true,
                                        },
                                    }).then((data) => data?.id) ?? await prisma.department.create({
                                        data: {
                                            name: "department1",
                                        },
                                    }).then((data) => data.id),
                                }
                            }
						},
					})
					.then((data) => data.id)),
		},
	});

	// 创建课程1
	await prisma.course.create({
		data: {
			name: "course1",
			description: "course1 description",
			credit: 3,
			departmentId:
				(await prisma.department
					.findFirst({
						where: {
							name: "department1",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.department
					.create({
						data: {
							name: "department1",
						},
					})
					.then((data) => data.id)),
		},
	});

	// 创建课程2
	await prisma.course.create({
		data: {
			name: "course2",
			description: "course2 description",
			credit: 2,
			departmentId:
				(await prisma.department
					.findFirst({
						where: {
							name: "department2",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.department
					.create({
						data: {
							name: "department2",
						},
					})
					.then((data) => data.id)),
		},
	});

	// 创建课程3
	await prisma.course.create({
		data: {
			name: "course3",
			description: "course3 description",
			credit: 3,
			departmentId:
				(await prisma.department
					.findFirst({
						where: {
							name: "department1",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.department
					.create({
						data: {
							name: "department1",
						},
					})
					.then((data) => data.id)),
		},
	});

	// 创建老师1
	await prisma.teacher.create({
		data: {
			name: "teacher1",
			email: "teacher1@example.com",
			title: "professor",
			sex: "m",
			departmentId:
				(await prisma.department
					.findFirst({
						where: {
							name: "department1",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.department
					.create({
						data: {
							name: "department1",
						},
					})
					.then((data) => data.id)),
		},
	});

	// 创建老师2
	await prisma.teacher.create({
		data: {
			name: "teacher2",
			email: "teacher2@example.com",
			title: "tutorial",
			sex: "f",
			departmentId:
				(await prisma.department
					.findFirst({
						where: {
							name: "department2",
						},
						select: {
							id: true,
						},
					})
					.then((data) => data?.id)) ??
				(await prisma.department
					.create({
						data: {
							name: "department2",
						},
					})
					.then((data) => data.id)),
		},
	});

	// 学生1选课程1
	await prisma.student.update({
		where: {
			id: 1,
		},
		data: {
			courses: {
				connect: {
					id: 1,
				},
			},
		},
	});

	// 班级1选课程2
	await prisma.class.update({
		where: {
			id: 1,
		},
		data: {
			courses: {
				connect: {
					id: 2,
				},
			},
		},
	});

	// 老师1教课程1
	await prisma.teacher.update({
		where: {
			id: 1,
		},
		data: {
			courses: {
				connect: {
					id: 1,
				},
			},
		},
	});

	// 创建时间段1
	await prisma.timeBlock.create({
		data: {
			week_start: 1,
			week_end: 16,
			day_of_week: 1,
			start: 1,
			end: 2,
			location: {
				connect: {
					id:
						(await prisma.location
							.findFirst({
								where: {
									name: "location1",
								},
								select: {
									id: true,
								},
							})
							.then((data) => data?.id)) ??
						(await prisma.location
							.create({
								data: {
									name: "location1",
									address: "address1",
								},
							})
							.then((data) => data.id)),
				},
			},
		},
	});

	// 创建时间段2
	await prisma.timeBlock.create({
		data: {
			week_start: 1,
			week_end: 16,
			day_of_week: 2,
			start: 3,
			end: 4,
			location: {
				connect: {
					id:
						(await prisma.location
							.findFirst({
								where: {
									name: "location2",
								},
								select: {
									id: true,
								},
							})
							.then((data) => data?.id)) ??
						(await prisma.location
							.create({
								data: {
									name: "location2",
									address: "address2",
								},
							})
							.then((data) => data.id)),
				},
			},
		},
	});

	// 课程1安排时间段1和地点1
	await prisma.course.update({
		where: {
			id: 1,
		},
		data: {
			time_blocks: {
				connect: {
					id: 1,
				},
			},
		},
	});

	// 课程2安排时间段2和地点2
	await prisma.course.update({
		where: {
			id: 2,
		},
		data: {
			time_blocks: {
				connect: {
					id: 2,
				},
			},
		},
	});

	// 安排课程1的考试
	await prisma.exam.create({
		data: {
			name: "exam1",
			course: {
				connect: {
					id: 1,
				},
			},
			location: {
				connect: {
					id:
						(await prisma.location
							.findFirst({
								where: {
									name: "location3",
								},
								select: {
									id: true,
								},
							})
							.then((data) => data?.id)) ??
						(await prisma.location
							.create({
								data: {
									name: "location3",
									address: "address3",
								},
							})
							.then((data) => data.id)),
				},
			},
			start: new Date("2024-05-16 20:00").toISOString(),
			end: new Date("2024-05-16 22:00").toISOString(),
		},
	});

	// 设置课程1的考试成绩
	await prisma.score.create({
		data: {
			student: {
				connect: {
					id: 1,
				},
			},
			exam: {
				connect: {
					id: 1,
				},
			},
			score: 90,
		},
	});

	// 创建通知1
    await prisma.notice.create({
		data: {
			title: "notice1",
			content: "notice1 content",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
