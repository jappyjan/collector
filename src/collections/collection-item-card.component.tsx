import {Button, Card, CardBody, CardFooter, Heading, Stack, Image, Text} from "@chakra-ui/react";
import React from "react";

interface Props {
    title: string,
    description?: string,
    thumbnailUrl?: string,
    primaryBtnLabel?: string,
    onPrimaryBtnClick?: () => void,
    secondaryBtnLabel?: string,
    onSecondaryBtnClick?: () => void,
}

export function CollectionItemCardComponent(props: Props) {
    const {
        title,
        description,
        thumbnailUrl,
        primaryBtnLabel,
        onPrimaryBtnClick,
        secondaryBtnLabel,
        onSecondaryBtnClick,
    } = props;

    return (
        <Card
            direction={{base: 'column', sm: 'row'}}
            overflow='hidden'
            variant='outline'
        >
            {thumbnailUrl && (
                <Image
                    objectFit='cover'
                    maxW={{base: '100%', sm: '200px'}}
                    src={thumbnailUrl}
                    alt='Caffe Latte'
                />
            )}

            <Stack>
                <CardBody>
                    <Heading size='md'>{title}</Heading>

                    {description && (
                        <Text py='2'>
                            {description}
                        </Text>
                    )}
                </CardBody>

                <CardFooter>
                    {primaryBtnLabel && (
                        <Button variant='solid' colorScheme='blue' onClick={onPrimaryBtnClick}>
                            {primaryBtnLabel}
                        </Button>
                    )}
                    {secondaryBtnLabel && (
                        <Button variant='ghost' onClick={onSecondaryBtnClick}>
                            {secondaryBtnLabel}
                        </Button>
                    )}
                </CardFooter>
            </Stack>
        </Card>
    )
}