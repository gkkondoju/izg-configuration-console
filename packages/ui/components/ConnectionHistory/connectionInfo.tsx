import * as React from "react";
import { Box, Typography , CardHeader , Card, CardContent, Divider} from "@mui/material";
import Link from 'next/link'
import Status from "../Status"

interface InfoProps {
    destinationById: {
      dest_uri: String,
      dest_type: {
        type: String,
      }
      jurisdiction: {
        description: String,
      }
      status : {
        status: String
      }
    }
}

const ConnectionInfo = ({destinationById} : InfoProps) => {

  return (
    <div>
    <Card sx={{ marginTop:4, borderRadius: '0px 0px 16px 16px'}} id="connection-info">
    <CardHeader title="Connection Info"/>
    <Divider />
      <CardContent>
      <Box sx={{ display:'flex', gap:'2rem'}}>
          <Box sx={{ display:'flex', flexDirection:'column', gap:'2rem'}}> 
            <Box>
            <Typography variant="subtitle1" component="div">
              ENVIRONMENT
            </Typography>
            <Typography gutterBottom variant="body1">
              {destinationById.dest_type.type}
            </Typography>
            </Box>
            <Box>
            <Typography variant="subtitle1" component="div">
              ENDPOINT URL
            </Typography>
            <Typography>
              <Link href={destinationById.dest_uri.toString()}>
              <a target="_blank" style={{ color:'#015A2F', overflowWrap:'anywhere'}}>{destinationById.dest_uri.toString()}</a>
              </Link>
            </Typography>
            </Box>
          </Box>
          <Box sx={{ display:'flex', flexDirection:'column', gap:'2rem'}}>
            <Box>
              <Typography variant="subtitle1" component="div" >
                JURISDICTION
              </Typography>
              <Typography gutterBottom variant="body1"> 
                {destinationById.jurisdiction === null ? 'N/A' :destinationById.jurisdiction.description}  
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1"  component="div">
                STATUS
              </Typography>
              <Status status={destinationById.status} color={false}/>
            </Box>
          </Box>
      </Box>
    </CardContent>
    </Card>
    </div>
  );
};

export default ConnectionInfo;