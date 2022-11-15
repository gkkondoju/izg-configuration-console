import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorIcon from "@mui/icons-material/Error";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Container,
  Box,
  ButtonGroup,
  Typography,
  Divider,
  Button,
  LinearProgress,
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
  Chip,
} from "@mui/material";

interface dataListProps {
  data: any,
  destinationById: {
    dest_type: {
      type: String,
    }
    jurisdiction: {
      description: String,
    }
  }
}

const dataList = ({data, destinationById}:dataListProps) => {

  const handleBack =()=>{
    history.back();
  }
  const componentRef = useRef(null);
  const passeddata = data.filter((item) => item.status === "PASS").length;
  const totaldata = data.length;
  const progressPct = Number(((passeddata / totaldata) * 100).toFixed());

  const list = () => (
    <>
      <List>
        {data.map((item, index) => (
          <>
            <ListItem key={index}>
              <ListItemIcon>
                {item.status === "PASS" && <CheckCircleIcon color="primary" />}
                {item.status === "FAIL" && <ErrorIcon color="secondary" />}
                {item.status === "WARNING" && (
                  <ReportProblemIcon color="warning" />
                )}
                {item.status === "SKIPPED" && (
                  <ErrorOutlineIcon sx={{ color: "#424242" }} />
                )}
              </ListItemIcon>

              {item.status === "PASS" ? (
                <ListItemText primary={item.name} />
              ) : item.status === "SKIPPED" ? (
                <ListItemText
                  primary={item.name}
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="default">
                        Cannot test Further on failure
                      </Typography>
                    </React.Fragment>
                  }
                />
              ) : (
                <ListItemText
                  primary={item.name}
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="secondary">
                        {item.message}
                      </Typography>
                    </React.Fragment>
                  }
                />
              )}
              <Chip
                label={item.status === "SKIPPED" ? "N/A" : item.status}
                variant="outlined"
                color={
                  item.status === "PASS"
                    ? "primary"
                    : item.status === "SKIPPED"
                    ? "default"
                    : "secondary"
                }
                sx={{
                  borderRadius: "4px",
                  marginTop: "8px",
                }}
              />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </>
  );

  const buttonGroup = () => (
    <Container
          maxWidth="sm"
          sx={{
            marginTop: 4,
          }}
        >
          <ButtonGroup
            variant="contained"
            fullWidth
            size="large"
            sx={{
              margin: "1em",
              alignItems: "center",
              borderRadius: "30px",
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={handleBack}
              sx={{
                borderRadius: "30px",
              }}
            >
              BACK TO CONNECTIONS
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<PrintIcon />}
                  sx={{
                    borderRadius: "30px",
                  }}
                >
                  PRINT
                </Button>
              )}
              content={() => componentRef.current}
            />
          </ButtonGroup>
        </Container>
  )

  return (
    <div sx={{ position: "relative" }}>
      <div>
        <Container ref={componentRef}>
          <Box sx={{ marginTop: 8 }}>
            <Typography
              gutterBottom
              align="center"
              variant="h1"
              fontWeight={700}
              fontSize="32px"
              id="test-connection"
            >
              Running Test for {destinationById.jurisdiction === null ? 'N/A' : destinationById.jurisdiction.description} {destinationById.dest_type.type}
            </Typography>
            <Typography align="center" variant="body1">
              Some text stating that this is only testing the connection and
              they cant edit any fields
            </Typography>
          </Box>
          <Card
            sx={{ marginTop: 4, borderRadius: "0px 0px 16px 16px" }}
            id="test-connection-info"
          >
            <CardHeader title="Test your connections" />
            <Divider />
            <CardContent>
              <Typography variant="body1">
                <Box component="span" fontWeight="fontWeightMedium">
                  {progressPct}% Passed
                </Box>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressPct}
                sx={{
                  marginTop: 1,
                  marginBottom: 1,
                  height: 8,
                  borderRadius: "8px",
                }}
              />
              <Typography variant="body1">
                {passeddata} out of {totaldata} Test Passed
              </Typography>
              {list()}
            </CardContent>
          </Card>
        </Container>
        {buttonGroup()}
      </div>
    </div>
  );
};

export default dataList;
