import {
	CircularProgress,
	CircularProgressLabel,
	Heading,
	HStack,
	SimpleGrid,
	Skeleton,
	SkeletonText,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import Button from "@components/button";
import Layout from "@components/dashboard/layout";
import NextChakraLink from "@components/nextChakraLink";
import { useAuth } from "@providers/authContext";
import { rounded, shadow } from "@styles/theme";
import { getUserCourses } from "api/index";
import { useEffect, useState } from "react";
import { FaFire } from "react-icons/fa";

export default function Dashboard() {
	const { user, isAuthenticated } = useAuth();
	const [courses, setCourses] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// setTimeout(() => {
		getUserCourses()
			.then(({ data }) => {
				if (data.status === 401) {
					window.location.href = "/login";
				}
				data.forEach((course, index) => {
					let completedLessons = 0;
					course.lessons.forEach((lesson) => {
						if (lesson.progress == 1) {
							completedLessons++;
						}
					});
					data[index].progress = parseFloat(
						(completedLessons / course.lessons.length).toFixed(4)
					);
				});
				setCourses(data);
			})
			.catch((res) => {
				console.log(res);
			});
		setIsLoaded(true);
		// }, 1000);
	}, []);

	function EnrollMore() {
		return (
			<Skeleton
				isLoaded={isLoaded}
				rounded={rounded}
				shadow={shadow}
				w="100%"
			>
				<Card href="/dashboard/courses">
					<VStack spacing={3}>
						<Heading size="md">Enroll in more courses.</Heading>
						<Button>Enroll</Button>
					</VStack>
				</Card>
			</Skeleton>
		);
	}

	return (
		<Layout>
			<VStack
				px={{ base: 4, md: 8 }}
				pt={{ base: 5, md: 10 }}
				spacing={{ base: 5, md: 10 }}
			>
				<HStack spacing={20}>
					<Stack>
						<SkeletonText
							isLoaded={isAuthenticated}
							noOfLines={1}
							w="fit-content"
						>
							<Heading as="h1">
								Welcome back, {user?.firstName || "Soph"}!
							</Heading>
						</SkeletonText>
						<SkeletonText
							isLoaded={isAuthenticated}
							noOfLines={1}
							w="fit-content"
						>
							<Text>
								You're doing great this week, keep it up!
							</Text>
						</SkeletonText>
					</Stack>

					<HStack>
						<SkeletonText
							isLoaded={isAuthenticated}
							noOfLines={1}
							w="fit-content"
						>
							<Heading as="h1" size="md">
								1
							</Heading>
						</SkeletonText>
						<FaFire color="red" size="50px" />
					</HStack>
				</HStack>
				<HStack>
					<Stack maxW="1000px">
						<Heading>Course Progress</Heading>
						<SimpleGrid
							columns={{ base: 1, lg: 2, xl: 3 }}
							gap={10}
						>
							{courses.map((course) => (
								<Stat key={course.id} course={course} />
							))}
							{[0, 1, 2].map(
								(num) =>
									courses.length <= num && (
										<EnrollMore key={num} />
									)
							)}
						</SimpleGrid>
					</Stack>
				</HStack>
			</VStack>
		</Layout>
	);
}

function Card({ children, href, ...props }) {
	return (
		<NextChakraLink href={href} w="100%">
			<VStack
				px={10}
				py={5}
				bg="secondary"
				rounded={rounded}
				shadow={shadow}
				w="100%"
				h="250px"
				justify="center"
				transition="all 0.2s ease"
				_hover={{ transform: "scale(1.05)", cursor: "pointer" }}
				{...props}
			>
				{children}
			</VStack>
		</NextChakraLink>
	);
}

function Stat({ course }) {
	return (
		<Card
			href={`/dashboard/courses/${course.id}/lessons/${course.currentLesson}`}
		>
			<CircularProgress
				value={course.progress * 100}
				color="primary"
				size="120px"
			>
				<CircularProgressLabel>
					{course.progress * 100}%
				</CircularProgressLabel>
			</CircularProgress>
			<Stack>
				<Heading size="sm">{course.name}</Heading>
				<HStack justify="space-between">
					<Text>{course.lessons.length} lessons</Text>
					<Text>{course.students} students</Text>
				</HStack>
			</Stack>
		</Card>
	);
}
