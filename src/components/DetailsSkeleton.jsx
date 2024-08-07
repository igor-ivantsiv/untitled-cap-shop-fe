import { Flex, Skeleton, Stack } from "@mantine/core";

const DetailsSkeleton = () => {
    
  
  return (
    <>
      <Flex miw={{ base: 200, md: 500 }} h={{ base: 300, md: 400 }}>
        <Skeleton h="100%" width="100%" />
      </Flex>

      <Stack gap={20} miw={400}>
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={80} />
      </Stack>
    </>
  );
};

export default DetailsSkeleton;
